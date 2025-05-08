interface GenreTagProps {
  name: string;
  onClick?: () => void;
  isActive?: boolean;
}

const GenreTag = ({ name, onClick, isActive = false }: GenreTagProps) => {
  return (
    <span 
      className={`tag text-sm px-3 py-1 rounded-full cursor-pointer transition-all ${
        isActive 
          ? 'bg-primary text-white' 
          : 'bg-gray-200 dark:bg-neutral-dark text-gray-700 dark:text-gray-300 hover:bg-primary/20 dark:hover:bg-primary/30'
      }`}
      onClick={onClick}
    >
      {name}
    </span>
  );
};

export default GenreTag;
