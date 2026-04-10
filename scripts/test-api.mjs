const BASE_URL = 'http://localhost:3000/api';

async function runTests() {
  console.log('🚀 Starting API Tests...\n');

  try {
    // 1. GET /tasks
    console.log('Testing GET /api/tasks...');
    const getRes = await fetch(`${BASE_URL}/tasks`);
    if (!getRes.ok) throw new Error(`GET failed: ${getRes.status}`);
    const initialTasks = await getRes.json();
    console.log(`✅ GET success: Found ${initialTasks.length} tasks.\n`);

    // 2. POST /tasks
    console.log('Testing POST /api/tasks...');
    const postRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test API Task' }),
    });
    if (!postRes.ok) throw new Error(`POST failed: ${postRes.status}`);
    const newTask = await postRes.json();
    console.log('✅ POST success:', newTask, '\n');

    // 3. PATCH /tasks/:id (Complete)
    console.log(`Testing PATCH /api/tasks/${newTask.id} (status)...`);
    const patchRes = await fetch(`${BASE_URL}/tasks/${newTask.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true }),
    });
    if (!patchRes.ok) throw new Error(`PATCH failed: ${patchRes.status}`);
    const updatedTask = await patchRes.json();
    if (updatedTask.completed !== true) throw new Error('PATCH failed: status not updated');
    console.log('✅ PATCH status success\n');

    // 4. PATCH /tasks/:id (Title)
    console.log(`Testing PATCH /api/tasks/${newTask.id} (title)...`);
    const patchTitleRes = await fetch(`${BASE_URL}/tasks/${newTask.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test API Task Updated' }),
    });
    if (!patchTitleRes.ok) throw new Error(`PATCH failed: ${patchTitleRes.status}`);
    const updatedTitleTask = await patchTitleRes.json();
    if (updatedTitleTask.title !== 'Test API Task Updated') throw new Error('PATCH failed: title not updated');
    console.log('✅ PATCH title success\n');

    // 5. DELETE /tasks/:id
    console.log(`Testing DELETE /api/tasks/${newTask.id}...`);
    const deleteRes = await fetch(`${BASE_URL}/tasks/${newTask.id}`, {
      method: 'DELETE',
    });
    if (!deleteRes.ok) throw new Error(`DELETE failed: ${deleteRes.status}`);
    console.log('✅ DELETE success\n');

    console.log('🎉 All API tests passed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

runTests();
