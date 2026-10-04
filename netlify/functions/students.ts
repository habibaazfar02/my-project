import { getDatabase } from "@netlify/database";

export default async (req: Request) => {
  try {
    const db = getDatabase();

    await db.sql`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL
      );
    `;

    if (req.method === "GET") {
      const students = await db.sql`
        SELECT * FROM students
        ORDER BY id DESC
      `;

      return new Response(JSON.stringify(students), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    if (req.method === "POST") {
      const body = await req.json();

      const name = body.name?.trim();
      const email = body.email?.trim();

      if (!name || !email) {
        return new Response(
          JSON.stringify({
            error: "Name and email are required"
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }

      const result = await db.sql`
        INSERT INTO students (name, email)
        VALUES (${name}, ${email})
        RETURNING *
      `;

      return new Response(JSON.stringify(result[0]), {
        status: 201,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Unknown error"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};
