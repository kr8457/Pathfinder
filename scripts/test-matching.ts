async function testMatches() {
  const profile = {
    field: "Computer Science",
    budget: "Free",
    destinations: ["Germany"],
    ielts: 6.5,
    degree: "Masters"
  };

  console.log("Testing matching APIs...");
  try {
    const uniRes = await fetch("http://localhost:3000/api/match-universities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    });
    const uniData = await uniRes.json();
    console.log("Universities found:", uniData.universities?.length || 0);

    const intRes = await fetch("http://localhost:3000/api/match-internships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    });
    const intData = await intRes.json();
    console.log("Internships found:", intData.internships?.length || 0);
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

testMatches();
