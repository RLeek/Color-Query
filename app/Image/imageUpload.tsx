'use client'

export default function ImageUpload({image, setImage} : {image:File|null, setImage: Function}) {
  
  //@ts-ignore
  function dropHandler(ev) {
    console.log("File(s) dropped");
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
    <div className="relative">
      <div className="absolute top-0 p-12 bg-red-800">
        Upload file!
      </div>
      <input
        type="file"
        onChange={uploadFile}
        className="p-12 bg-red-800 opacity-0"
        id="drop_zone"
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDrop={dropHandler}
      ></input>
    </div>
    </>
  );
}