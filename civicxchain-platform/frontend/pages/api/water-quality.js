export default async function handler(req, res) {
    const { region } = req.query;
    
    try {
      const response = await fetch(`https://www.waterqualitydata.us/data/Result/search?countrycode=US&mimeType=json&zip=yes`);
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch water quality data' });
    }
  }