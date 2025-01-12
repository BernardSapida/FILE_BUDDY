import crypto from 'crypto';

// Zip files by public_id
export async function POST(request: Request) {
   const body = await request.json();
   const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
   const apiKey = process.env.CLOUDINARY_API_KEY;
   const apiSecret = process.env.CLOUDINARY_API_SECRET;

   // string publicIds
   const joinedPublicIds = body.public_ids.join(',');

   // Generate timestamp
   const timestamp = new Date().getTime();

   // Create the string to sign
   const paramsToSign = `public_ids=${joinedPublicIds}&timestamp=${timestamp}`;

   // Generate signature using the API secret
   const signature = crypto
      .createHash('sha1')
      .update(paramsToSign + apiSecret)
      .digest('hex');

   // Request header
   const headers = new Headers();
   headers.append(
      'Authorization',
      `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`
   );
   headers.append('Content-Type', 'application/json');

   const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/generate_archive`;
   const requestOptions: RequestInit = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
         api_key: apiKey,
         signature: signature,
         timestamp: timestamp,
         public_ids: body.public_ids
      }),
      redirect: 'follow'
   };

   try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      console.log({ success: true, data });

      return Response.json({ success: true, data });
   } catch (error) {
      console.error('Error downloading file:', error);
      return Response.json({ success: false, error });
   }
}

// Delete files by asset_ids
export async function DELETE(request: Request) {
   const body = await request.json();
   const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
   const apiKey = process.env.CLOUDINARY_API_KEY;
   const apiSecret = process.env.CLOUDINARY_API_SECRET;

   const headers = new Headers();
   headers.append(
      'Authorization',
      `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`
   );
   headers.append('Content-Type', 'application/json');

   const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/`;
   const requestOptions: RequestInit = {
      method: 'DELETE',
      headers: headers,
      body: JSON.stringify(body),
      redirect: 'follow'
   };

   try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      return Response.json({ success: true, data });
   } catch (error) {
      console.error('Error downloading file:', error);
      return Response.json({ success: false, error });
   }
}
