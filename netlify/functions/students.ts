import { getDatabase } from "@netlify/database";

export default async (req: Request) => {

  try {

    const db = getDatabase();

    // Create the students table if it does not exist
    await db.sql`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        course VARCHAR(100) NOT NULL
      );
    `;

    // Check whether the table already contains students
    const existing = await db.sql`
      SELECT COUNT(*) FROM students;
    `;

    // Add initial data if the table is empty
    if (parseInt(existing[0].count) === 0) {

      await db.sql`
        INSERT INTO students (name, email, course)
        VALUES
          (
            'Ali Khan',
            'ali@example.com',
            'Computer Science'
          ),
          (
            'Sara Ahmed',
            'sara@example.com',
            'Software Engineering'
          ),
          (
            'Hamza Malik',
            'hamza@example.com',
            'Information Technology'
          ),
          (
            'Ayesha Noor',
            'ayesha@example.com',
            'Computer Science'
          );
      `;

    }

    // Get all students
    const students = await db.sql`
      SELECT id, name, email, course
      FROM students
      ORDER BY id;
    `;

    // Return students to the frontend
    return new Response(
      JSON.stringify(students),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (err) {

    console.error(err);

    return new Response(
      JSON.stringify({
        error:
          err instanceof Error
            ? err.message
            : "Unknown database error"
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
