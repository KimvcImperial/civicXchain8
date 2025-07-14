export default async function handler(req, res) {
    const { lat, lon } = req.query;
    
    // Return real environmental data
    try {
      const response = await fetch(`https://modis.ornl.gov/rst/api/v1/MOD44B/subset?latitude=${lat}&longitude=${lon}&product=MOD44B&year=2023&kmAboveBelow=1&kmLeftRight=1`);
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch forest data' });
    }
  }