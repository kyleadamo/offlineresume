// Renders a fully-formed HTML document to PDF via Browserless.io.
// The client sends the EXACT paginated HTML produced by Paged.js plus all
// CSS needed to style it (light-theme tokens + Google Fonts), so this
// function does no template knowledge whatsoever — it just hands HTML to
// headless Chromium.
//
// Theming guard: the client wraps content in <div class="resume-document">
// and includes the full token block. Do not strip or rewrite either —
// removing them has caused dark-mode chrome to leak into the PDF before.

import { z } from "npm:zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MAX_HTML_BYTES = 2 * 1024 * 1024; // 2MB

const BodySchema = z.object({
  html: z.string().min(1),
  css: z.string().default(""),
  pageSize: z.enum(["letter", "a4"]).default("letter"),
  filename: z.string().min(1).max(200).default("resume.pdf"),
});

function sanitizeFilename(name: string): string {
  const trimmed = name.replace(/[^a-zA-Z0-9._-]/g, "_");
  return trimmed.toLowerCase().endsWith(".pdf") ? trimmed : `${trimmed}.pdf`;
}

function buildDocument(html: string, css: string): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap" />
    <style>
      html, body { margin: 0; padding: 0; background: white; }
      body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      ${css}
    </style>
  </head>
  <body>${html}</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const apiKey = Deno.env.get("BROWSERLESS_API_KEY");
  if (!apiKey) {
    console.error("[render-pdf] BROWSERLESS_API_KEY is not configured");
    return new Response(
      JSON.stringify({ error: "PDF service is not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const { html, css, pageSize, filename } = parsed.data;

  const docHtml = buildDocument(html, css);
  if (new TextEncoder().encode(docHtml).byteLength > MAX_HTML_BYTES) {
    return new Response(
      JSON.stringify({ error: "Document exceeds 2MB limit" }),
      { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const browserlessUrl = `https://production-sfo.browserless.io/pdf?token=${encodeURIComponent(apiKey)}`;

  const browserlessPayload = {
    html: docHtml,
    options: {
      printBackground: true,
      preferCSSPageSize: true,
      format: pageSize === "a4" ? "A4" : "Letter",
      margin: { top: "12mm", right: "16mm", bottom: "16mm", left: "16mm" },
    },
    gotoOptions: { waitUntil: "networkidle0" },
    waitForTimeout: 500,
  };

  let pdfResponse: Response;
  try {
    pdfResponse = await fetch(browserlessUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(browserlessPayload),
    });
  } catch (err) {
    console.error("[render-pdf] Browserless network error", err);
    return new Response(
      JSON.stringify({ error: "Failed to reach PDF service" }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  if (!pdfResponse.ok) {
    const detail = await pdfResponse.text().catch(() => "");
    console.error(
      `[render-pdf] Browserless error ${pdfResponse.status}: ${detail.slice(0, 500)}`,
    );
    return new Response(
      JSON.stringify({
        error: `PDF generation failed (${pdfResponse.status})`,
      }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const pdfBuffer = await pdfResponse.arrayBuffer();
  const safeName = sanitizeFilename(filename);

  return new Response(pdfBuffer, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeName}"`,
      "Cache-Control": "no-store",
    },
  });
});
