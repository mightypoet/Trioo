const fs = require('fs');
let code = fs.readFileSync('src/pages/CreateTripboard.tsx', 'utf8');

// replace ImageUploader
const uploaderOld = `function ImageUploader({ value, onChange, label = "Upload Image", className = "", user }: { value: string, onChange: (url: string) => void, label?: string, className?: string, user: any }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) {
      if (!user) alert("You must be logged in to upload images.");
      return;
    }

    setIsUploading(true);
    try {
      const fileName = \`\${user.id}-\${Date.now()}-\${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}\`;
      const { data, error } = await supabase.storage
        .from('tripboard-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('tripboard-images')
        .getPublicUrl(fileName);

      onChange(publicUrl);
    } catch (err: any) {
      console.error('Error uploading image:', err);
      alert('Upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (value) {
    return (
      <div className={\`relative rounded-xl border-4 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white \${className}\`}>
        <img src={value} alt="Uploaded preview" className="w-full h-48 object-cover" />
        <button 
          onClick={() => onChange('')} 
          className="absolute top-2 right-2 bg-red-400 border-2 border-black w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-red-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          title="Remove Image"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <label className={\`block bg-yellow-200 border-4 border-black border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-yellow-300 font-bold transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] \${className}\`}>
      <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={isUploading} />
      {isUploading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin mx-auto" />
          <span>Uploading...</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <ImageIcon className="w-6 h-6 mx-auto" />
          <span>{label}</span>
        </div>
      )}
    </label>
  );
}`;

const uploaderNew = `function ImageUploader({ values, onChange, label = "Upload Images", className = "", user }: { values: string[], onChange: (urls: string[]) => void, label?: string, className?: string, user: any }) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File) => {
    const fileName = \`\${user.id}-\${Date.now()}-\${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}\`;
    const { data, error } = await supabase.storage
      .from('tripboard-images')
      .upload(fileName, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage
      .from('tripboard-images')
      .getPublicUrl(fileName);
    return publicUrl;
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user) {
      if (!user) alert("You must be logged in to upload images.");
      return;
    }
    setIsUploading(true);
    try {
      const urls = await Promise.all(Array.from(files).map(file => uploadImage(file)));
      const validUrls = urls.filter(Boolean) as string[];
      onChange([...values, ...validUrls]);
    } catch (err: any) {
      console.error('Error uploading images:', err);
      alert('Upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const newValues = [...values];
    newValues.splice(index, 1);
    onChange(newValues);
  };

  return (
    <div className={\`space-y-4 \${className}\`}>
      <label className="block bg-yellow-200 border-4 border-black border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-yellow-300 font-bold transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <input type="file" accept="image/*" multiple className="hidden" onChange={handleBulkUpload} disabled={isUploading} />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            <span>Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="w-6 h-6 mx-auto" />
            <span>{label}</span>
          </div>
        )}
      </label>

      {values && values.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          {values.map((url, idx) => (
            <div key={idx} className="relative rounded-xl border-4 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white aspect-square">
              <img src={url} alt={\`Preview \${idx}\`} className="w-full h-full object-cover" />
              <button 
                onClick={(e) => { e.preventDefault(); handleRemove(idx); }} 
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full flex items-center justify-center hover:bg-red-600 transition-all z-10 w-6 h-6 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                title="Remove Image"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`;

code = code.replace(uploaderOld, uploaderNew);

code = code.replace("const [coverPhotoUrl, setCoverPhotoUrl] = useState('');", "const [coverPhotos, setCoverPhotos] = useState<string[]>([]);");
code = code.replace("const [itinerary, setItinerary] = useState([{ day: 1, title: '', description: '', transport: '', image: '' }]);", "const [itinerary, setItinerary] = useState([{ day: 1, title: '', description: '', transport: '', image_urls: [] as string[] }]);");
code = code.replace("const [stays, setStays] = useState([{ name: '', price: '', room: '', link: '', image: '' }]);", "const [stays, setStays] = useState([{ name: '', price: '', room: '', link: '', image_urls: [] as string[] }]);");
code = code.replace("const [food, setFood] = useState([{ name: '', dish: '', review: '', image: '' }]);", "const [food, setFood] = useState([{ name: '', dish: '', review: '', image_urls: [] as string[] }]);");

code = code.replace(/<ImageUploader value=\{coverPhotoUrl\} onChange=\{setCoverPhotoUrl\} label="Upload Cover Photo" user=\{user\} \/>/g, `<ImageUploader values={coverPhotos} onChange={setCoverPhotos} label="Upload Cover Photos" user={user} />`);

code = code.replace(/<ImageUploader value=\{day\.image \|\| ''\} onChange=\{\(url\) => \{ const newIt = \[\.\.\.itinerary\]; newIt\[i\]\.image = url; setItinerary\(newIt\); \}\} label="Upload Day Photo" user=\{user\} \/>/g, `<ImageUploader values={day.image_urls || []} onChange={(urls) => { const newIt = [...itinerary]; newIt[i].image_urls = urls; setItinerary(newIt); }} label="Upload Day Photos" user={user} />`);

code = code.replace(/setItinerary\(\[\.\.\.itinerary, \{ day: itinerary\.length \+ 1, title: '', description: '', transport: '', image: '' \}\]\)/g, `setItinerary([...itinerary, { day: itinerary.length + 1, title: '', description: '', transport: '', image_urls: [] }])`);


code = code.replace(/<ImageUploader value=\{stay\.image \|\| ''\} onChange=\{\(url\) => \{ const newS = \[\.\.\.stays\]; newS\[i\]\.image = url; setStays\(newS\); \}\} label="Upload Stay Photo" user=\{user\} \/>/g, `<ImageUploader values={stay.image_urls || []} onChange={(urls) => { const newS = [...stays]; newS[i].image_urls = urls; setStays(newS); }} label="Upload Stay Photos" user={user} />`);

code = code.replace(/setStays\(\[\.\.\.stays, \{ name: '', price: '', room: '', link: '', image: '' \}\]\)/g, `setStays([...stays, { name: '', price: '', room: '', link: '', image_urls: [] }])`);


code = code.replace(/<ImageUploader value=\{f\.image \|\| ''\} onChange=\{\(url\) => \{ const newF = \[\.\.\.food\]; newF\[i\]\.image = url; setFood\(newF\); \}\} label="Upload Food Photo" user=\{user\} \/>/g, `<ImageUploader values={f.image_urls || []} onChange={(urls) => { const newF = [...food]; newF[i].image_urls = urls; setFood(newF); }} label="Upload Food Photos" user={user} />`);

code = code.replace(/setFood\(\[\.\.\.food, \{ name: '', dish: '', review: '', image: '' \}\]\)/g, `setFood([...food, { name: '', dish: '', review: '', image_urls: [] }])`);


code = code.replace(`image: coverPhotoUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800',`, `image: coverPhotos[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800',\n      cover_images: coverPhotos,`);

fs.writeFileSync('src/pages/CreateTripboard.tsx', code);
console.log("Updated CreateTripboard.tsx");

