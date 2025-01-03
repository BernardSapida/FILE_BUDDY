const folders = [];
const public_files = [
   'bronze.png',
   'champion.png',
   'crystal.png',
   'gold.png',
   'goldpass.png',
   'legend.png',
   'master.png',
   'silver.png',
   'titan.png'
];

const handleDownload = (filename: string) => {
   // Create a link element
   const link = document.createElement('a');
   link.href = `/images/${filename}`; // Replace with your file URL or path
   link.download = filename;
   link.click(); // Trigger the download
};

for (let i = 0; i < public_files.length; i++) {
   folders.push({
      name: public_files[i],
      size: 1000,
      favorited: false,
      trashed: false,
      createdAt: new Date(),
      updatedAt: new Date()
   });
}

console.log(folders);
