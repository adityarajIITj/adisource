async function run() {
  const apiKey = "AIzaSyCgtmTTbDnKPdbdjpx3Sj4a7ixTyOoktfc";
  
  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp", "gemini-2.5-flash"];
  
  for (const model of models) {
    console.log(`\nTesting ${model}...`);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Say hello!" }] }]
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        console.log(`✅ Success for ${model}`);
      } else {
        console.log(`❌ Failed for ${model}:`, data.error.message);
      }
    } catch (e) {
      console.log(`❌ Network error for ${model}:`, e);
    }
  }
}

run();
