import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://twxdnwfwxhwvgisbfmbf.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3eGRud2Z3eGh3dmdpc2JmbWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNTY1MDMsImV4cCI6MjA5NTYzMjUwM30.NYh39mxWw4Pu5kDIww97trUsPDJvd2tdPSSXpH98BMk";

export const supabase = createClient(supabaseUrl, supabaseKey);