const user = new URLSearchParams(location.search).get("user") || "YOUR_USERNAME";

async function loadRepos(user) {
  const res = await fetch(`https://api.github.com/users/${user}/repos?per_page=100`);
  if (!res.ok) throw new Error("User not found or rate limit hit");
  return res.json();
}

loadRepos(user).then(repos => {
  repos.forEach((repo, i) => {
    const angle = i * 0.6;
    const distance = 40 + i * 12;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    const radius = 6 + Math.sqrt(repo.stargazers_count) * 3;
    // draw a circle at (x, y) with this radius, colored by repo.language
  });
});
