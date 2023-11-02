import { useEffect, useRef, useState } from 'react';
import { BsImage } from 'react-icons/bs';
import { ImCheckboxChecked } from 'react-icons/im';

import { Image, data } from './data';

function ImageGallery() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState(data);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File[]>([]);
  const [draggedImage, setDraggedImage] = useState<Image | null>(null);
  const [potentialDropIndex, setPotentialDropIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedImage(images[index]);
    setPotentialDropIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedImage !== null) {
      const newImages = [...images];
      const draggedImageIndex = images.indexOf(draggedImage);
      newImages.splice(index, 0, newImages.splice(draggedImageIndex, 1)[0]);
      setImages(newImages);
      setDraggedImage(null);
      setPotentialDropIndex(null);
    }
  };

  const handleImageSelect = (id: number) => {
    setSelectedImages((prevImages) => {
      if (prevImages.includes(id)) {
        return prevImages.filter((img) => img !== id);
      } else {
        return [...prevImages, id];
      }
    });
  };

  const handleDragOver = (index: number) => {
    if (potentialDropIndex !== null) {
      const newImages = [...images];
      newImages[index] = images[potentialDropIndex];
      newImages[potentialDropIndex] = images[index];
      setImages(newImages);
    }
  };

  const isImageSelected = (imageId: number) => selectedImages.includes(imageId);

  const handleDeleteFiles = () => {
    const newImages = images.filter((img) => !selectedImages.includes(img.id));
    setImages(newImages);
    setSelectedImages([]);
  };

  useEffect(() => {
    uploadedFile.forEach((item, index) => {
      setImages((prevImages) => [
        ...prevImages,
        { id: 12 + index, src: item },
      ]);
    });
  }, [uploadedFile]);

  return (
    <div className='wrapper'>
      <div className='img-gallery-top'>
        {selectedImages.length ? (
          <div className='img-gallery-top-left'>
            <ImCheckboxChecked size={30} color='blue' />
            <h5>{selectedImages.length} Files selected</h5>
          </div>
        ) : (
          <h2>Gallery</h2>
        )}
        {selectedImages.length > 0 && (
          <button onClick={handleDeleteFiles} className='delete-btn'>
            Delete files
          </button>
        )}
      </div>

      <div className='img-container'>
        {images.map((item, index) => (
          <div
            key={item.id}
            className={`img ${index === 0 ? 'tall wide' : ''} ${
              potentialDropIndex === index ? 'potential-drop-target' : ''
            }`}
            draggable={true}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => {
              e.preventDefault();
              setPotentialDropIndex(index);
              handleDragOver(index);
            }}
            onDrop={() => handleDrop(index)}
            onDragLeave={() => setPotentialDropIndex(null)}
          >
            <img
              src={
                typeof item.src === 'string'
                  ? item.src
                  : URL.createObjectURL(item.src)
              }
              loading='lazy'
              alt={'img-' + item.id}
            />
            <div
              className={`checkbox ${isImageSelected(item.id) ? 'checked' : ''}`}
              onClick={() => handleImageSelect(item.id)}
            >
              {isImageSelected(item.id) && (
                <ImCheckboxChecked size={30} color='blue' />
              )}
            </div>
          </div>
        ))}
        <div className='upload-img' onClick={() => inputRef.current?.click()}>
          <BsImage size={30} />
          <h4>Add images</h4>
          <input
            type='file'
            hidden
            multiple
            accept='image/*'
            onChange={(event) => {
              const files = event.target.files;
              if (files) {
                const filesArr: File[] = Array.from(files);
                setUploadedFile(filesArr);
              }
            }}
            ref={inputRef}
          />
        </div>
      </div>
    </div>
  );
}

export default ImageGallery;
