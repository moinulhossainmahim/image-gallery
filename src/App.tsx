import { useEffect, useRef, useState } from 'react'
import { BsImage } from "react-icons/bs";
import { ImCheckboxChecked } from 'react-icons/im';

import './App.css';

import { User, data } from './data';

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState(data);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File[]>([]);
  const [draggedImage, setDraggedImage] = useState<User | null>(null);
  const [potentialDropIndex, setPotentialDropIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedImage(images[index]);
    setPotentialDropIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedImage !== null) {
      const newImages = [...images];
      newImages[index] = draggedImage;
      newImages[images.indexOf(draggedImage)] = images[index];
      setImages(newImages);
      setDraggedImage(null);
      setPotentialDropIndex(null);
    }
  };

  function handleImageSelect(id: number) {
    if(selectedImages.includes(id)) {
      setSelectedImages((prevImages) => prevImages.filter((img) => img !== id));
    } else {
      setSelectedImages([...selectedImages, id]);
    }
  }

  const handleDragOver = (index: number) => {
    if (potentialDropIndex !== null) {
      const newImages = [...images];
      newImages[index] = images[potentialDropIndex];
      newImages[potentialDropIndex] = images[index];
      setImages(newImages);
    }
  };

  const isImageSelected = (imageId: number) => selectedImages.includes(imageId);

  function handleDeleteFiles() {
    selectedImages.forEach((image) => {
      setImages((prevImages) => prevImages.filter((img) => image !== img.id));
    })
    setSelectedImages([]);
  }

  useEffect(() => {
    uploadedFile.forEach((item, index) => {
      setImages((prevImages) => [...prevImages, { id: 12 + index, src: item }]);
    })
  }, [uploadedFile.length])

  return (
    <div className='wrapper'>
      {selectedImages.length ? (
        <div className='img-gallery-top'>
          <div className='img-gallery-top-left'>
            <ImCheckboxChecked size={30} color='blue' />
            <h5>{selectedImages.length} Files selected</h5>
          </div>
          <button onClick={handleDeleteFiles} className='delete-btn'>Delete files</button>
        </div>
      ) :
        <div className='img-gallery-top'>
          <h2>Gallery</h2>
        </div>
      }
      <div className="img-container">
        {images?.map((item, index) => (
          <div
            className={`img ${index === 0 ? 'tall wide' : ''} ${
              potentialDropIndex === index ? 'potential-drop-target' : ''
            }`}
            key={item.id}
            draggable={true}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => {
              e.preventDefault();
              setPotentialDropIndex(index);
              handleDragOver(index)
            }}
            onDrop={() => handleDrop(index)}
            onDragLeave={() => setPotentialDropIndex(null)}
          >
            <img src={typeof item.src === 'string' ? item.src : URL.createObjectURL(item.src)} alt={'img-' + item.id} />
            <div className={`checkbox ${isImageSelected(item.id) ? 'checked' : ''}`} onClick={() => handleImageSelect(item.id)}>
              {isImageSelected(item.id) && (
                <ImCheckboxChecked size={30} color='blue' />
              )}
            </div>
          </div>
        ))}
        <div className='upload-img' onClick={() => inputRef.current?.click()}>
          <BsImage size={30}/>
          <h4>
            Add images
          </h4>
          <input
            type='file'
            hidden
            multiple
            accept="image/*"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(event: any) => {
              const filesArr: File[] = Array.from(event.target.files);
              setUploadedFile(filesArr);
            }}
            ref={inputRef}
          />
        </div>
      </div>
    </div>
  )
}

export default App
