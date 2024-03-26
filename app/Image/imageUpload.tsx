'use client'

export default function ImageUpload({image, setImage} : {image:File|null, setImage: Function}) {
  
  //@ts-ignore
  function dropHandler(ev) {
    setImage(ev.dataTransfer.files[0])
    ev.preventDefault();
    ev.stopPropagation();
    
  }

  function uploadFile(ev:any) {
    setImage(ev.target.files[0])
  }

  function onDragEnter(ev: { stopPropagation: () => void; preventDefault: () => void; }) {
    ev.stopPropagation();
    ev.preventDefault();
  }

  function onDragOver(ev: { stopPropagation: () => void; preventDefault: () => void; }) {
    ev.stopPropagation();
    ev.preventDefault();
  }

  return (
    <>
      <div className="grid pt-8 w-10/12 h-70svh md:w-9/12 xl:w-6/12">
        <div className="bg-zinc-300 flex flex-col justify-center place-items-center text-xl" style={{gridColumn: 1, gridRow: 1}} >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 my-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          Upload an image
        </div>
        <input
          type="file"
          onChange={uploadFile}
          className="opacity-0"
          style={{gridColumn: 1, gridRow: 1}}
          id="drop_zone"
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDrop={dropHandler}
        >
        </input>
      </div>
    </>
  );
}