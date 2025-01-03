export async function DELETE(request: Request) {
   const body = await request.json();
   const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
   const apiKey = process.env.CLOUDINARY_API_KEY;
   const apiSecret = process.env.CLOUDINARY_API_SECRET;

   console.log(body);

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
