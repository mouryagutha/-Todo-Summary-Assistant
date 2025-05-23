import { TodoSummarizer } from './services/summarizer';

async function testSummarizer() {
  try {
    console.log('🔍 Testing Todo Summarization...');
    
    // Create test todos
    const todos = [
      {
        id: '1',
        title: 'Complete project proposal',
        description: 'Write and submit the project proposal for the new client project',
        status: 'pending' as const,
        priority: 'high' as const,
        dueDate: new Date('2024-05-30')
      },
      {
        id: '2',
        title: 'Review pull requests',
        description: 'Review and merge pending pull requests from the team',
        status: 'completed' as const,
        priority: 'medium' as const,
        dueDate: new Date('2024-05-25')
      },
      {
        id: '3',
        title: 'Update documentation',
        description: 'Update the API documentation with new endpoints',
        status: 'pending' as const,
        priority: 'low' as const,
        dueDate: new Date('2024-06-01')
      }
    ];

    const summarizer = new TodoSummarizer();
    console.log('\nGenerating summary for test todos...');
    const summary = await summarizer.summarizeTodos(todos);

    console.log('\n✅ Summary Generated:');
    console.log('----------------------------------------');
    console.log(summary);
    console.log('----------------------------------------');

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testSummarizer()
  .then(() => {
    console.log('\n🎉 Todo summarization test passed!');
    process.exit(0);
  })
  .catch((error: any) => {
    console.error('\n❌ Test failed:', error.message || 'Unknown error');
    process.exit(1);
  }); 