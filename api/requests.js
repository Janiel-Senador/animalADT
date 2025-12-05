import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const requests = await prisma.request.findMany();
      return res.status(200).json(requests);
    } 
    
    if (req.method === 'POST') {
      const data = req.body;
      
      // Separate position [lat, lng] into lat/lng fields
      const { position, ...rest } = data;
      
      const request = await prisma.request.create({
        data: {
          ...rest,
          lat: position[0],
          lng: position[1],
        },
      });
      return res.status(201).json(request);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Request error:', error);
    return res.status(500).json({ error: 'Error processing request' });
  }
}
