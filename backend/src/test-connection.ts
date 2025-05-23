import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function testConnection() {
  try {
    // Test 1: Basic connection
    console.log('🔍 Testing Supabase connection...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('todos')
      .select('*')
      .limit(0);

    if (tableError) {
      throw new Error(`Table error: ${tableError.message}`);
    }
    console.log('✅ Successfully connected to Supabase!');

    // Test 2: Insert a test todo
    console.log('\n🔍 Testing todo creation...');
    const testTodo = {
      title: 'Test Todo',
      description: 'This is a test todo item',
      completed: false
    };

    const { data: insertedTodo, error: insertError } = await supabase
      .from('todos')
      .insert(testTodo)
      .select()
      .single();

    if (insertError) {
      throw new Error(`Insert error: ${insertError.message}`);
    }
    console.log('✅ Successfully created a test todo:');
    console.log(insertedTodo);

    // Test 3: Fetch the created todo
    console.log('\n🔍 Testing todo retrieval...');
    const { data: todos, error: fetchError } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError) {
      throw new Error(`Fetch error: ${fetchError.message}`);
    }
    console.log('✅ Successfully retrieved todos:');
    console.log(todos);

    // Test 4: Update the todo
    console.log('\n🔍 Testing todo update...');
    const { data: updatedTodo, error: updateError } = await supabase
      .from('todos')
      .update({ completed: true })
      .eq('id', insertedTodo.id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Update error: ${updateError.message}`);
    }
    console.log('✅ Successfully updated todo:');
    console.log(updatedTodo);

    // Test 5: Delete the test todo
    console.log('\n🔍 Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('todos')
      .delete()
      .eq('id', insertedTodo.id);

    if (deleteError) {
      throw new Error(`Delete error: ${deleteError.message}`);
    }
    console.log('✅ Successfully cleaned up test data');

  } catch (error: any) {
    console.error('❌ Test failed:', error.message || 'Unknown error');
    process.exit(1);
  }
}

testConnection()
  .then(() => {
    console.log('\n🎉 All tests passed! Your Supabase setup is working correctly!');
    process.exit(0);
  })
  .catch((error: any) => {
    console.error('\n❌ Tests failed:', error.message || 'Unknown error');
    process.exit(1);
  }); 