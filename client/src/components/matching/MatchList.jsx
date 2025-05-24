import MatchCard from "./MatchCard";

export default function MatchList({ matches }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((user, index) => (
        <MatchCard key={index} user={user} />
      ))}
    </div>
  );
}
