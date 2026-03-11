import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AssetData {
  laptopDetails: string;
  serialNumber: string;
  employeeId: string;
  contactNumber: string;
  employeeEmail: string;
  supportContact: string;
  companyLink: string;
  generatedAt: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);

    if (req.method === "POST" && pathParts[pathParts.length - 1] === "assets") {
      const assetData: AssetData = await req.json();

      if (
        !assetData.laptopDetails ||
        !assetData.serialNumber ||
        !assetData.employeeId ||
        !assetData.contactNumber ||
        !assetData.employeeEmail ||
        !assetData.supportContact ||
        !assetData.companyLink ||
        !assetData.generatedAt
      ) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const { data, error } = await supabase
        .from("laptop_assets")
        .insert([
          {
            laptop_details: assetData.laptopDetails,
            serial_number: assetData.serialNumber,
            employee_id: assetData.employeeId,
            contact_number: assetData.contactNumber,
            employee_email: assetData.employeeEmail,
            support_contact: assetData.supportContact,
            company_link: assetData.companyLink,
            generated_at: assetData.generatedAt,
          },
        ])
        .select("id")
        .single();

      if (error) {
        console.error("Database error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to save asset" }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      return new Response(
        JSON.stringify({ id: data.id }),
        {
          status: 201,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (req.method === "GET") {
      const assetId = pathParts[pathParts.length - 1];

      if (!assetId || assetId === "assets") {
        return new Response(
          JSON.stringify({ error: "Asset ID is required" }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const { data, error } = await supabase
        .from("laptop_assets")
        .select("*")
        .eq("id", assetId)
        .maybeSingle();

      if (error) {
        console.error("Database error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to fetch asset" }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (!data) {
        return new Response(
          JSON.stringify({ error: "Asset not found" }),
          {
            status: 404,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const responseData: AssetData = {
        laptopDetails: data.laptop_details,
        serialNumber: data.serial_number,
        employeeId: data.employee_id,
        contactNumber: data.contact_number,
        employeeEmail: data.employee_email,
        supportContact: data.support_contact,
        companyLink: data.company_link,
        generatedAt: data.generated_at,
      };

      return new Response(
        JSON.stringify(responseData),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
