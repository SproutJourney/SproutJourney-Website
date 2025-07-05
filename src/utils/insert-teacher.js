// Simple script to add a teacher to the Supabase database
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Supabase connection details
const supabaseUrl = 'https://gwaljfvwhjedmtwqpbzk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3YWxqZnZ3aGplZG10d3FwYnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MzQwMDUsImV4cCI6MjA2NzExMDAwNX0.ijOHlhNI6cae07OgL07WAStAqoghfOdIWofODaHzy0A';
const supabase = createClient(supabaseUrl, supabaseKey);

// Teacher details
const teacher = {
    name: 'Kartikey Patel',
    emp_id: 'FAC123',
    emp_username: 'FAC123',
    emp_password: 'FAC123' // Will be hashed before storing
};

async function addTeacher() {
    try {
        console.log('Hashing password...');
        // Hash the password with bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(teacher.emp_password, salt);

        console.log('Inserting teacher into database...');
        // Insert the teacher into the database
        const { data, error } = await supabase
            .from('teachers')
            .insert([
                {
                    name: teacher.name,
                    emp_id: teacher.emp_id,
                    emp_username: teacher.emp_username,
                    emp_password: hashedPassword
                }
            ])
            .select();

        if (error) {
            console.error('Error inserting teacher:', error);
        } else {
            console.log('Teacher inserted successfully:', data);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

// Run the function
addTeacher().then(() => console.log('Script completed')); 