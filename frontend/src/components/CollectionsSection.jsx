import CollectionCard from "./CollectionCard";

const CollectionsSection = ({ exhibitions, onDelete , onEdit }) => {
  return (
    <div className="space-y-6">
      {exhibitions.map((exhibition) => (
        <CollectionCard
          key={exhibition.id}
          exhibition={exhibition}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default CollectionsSection;