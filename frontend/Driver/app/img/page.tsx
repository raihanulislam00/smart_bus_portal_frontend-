import Image from 'next/image';

export default function ImageComponent() {
  return (
    <div className="text-center">
      <Image 
        src="/bus.png"
        alt="Bus"
        width={900}
        height={300}
        priority
         style={{
          width: '50%',
          height: 'auto',
        }}
      />
    </div>
  );
}