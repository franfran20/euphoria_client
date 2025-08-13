import { BOOK_GENRES } from "@/utils/constants";

export const Genres = ({ genres }: { genres: number[] }) => {
  return (
    <div className="genres">
      {genres[0] && <span>{BOOK_GENRES[genres[0]]}</span>}
      {genres[0] && genres[1] && (
        <div className="littleCircle" style={{ marginRight: "7px" }}></div>
      )}

      {genres[1] && <span>{BOOK_GENRES[genres[1]]}</span>}
      {genres[1] && genres[2] && (
        <div className="littleCircle" style={{ marginRight: "7px" }}></div>
      )}

      {genres[2] && <span>{BOOK_GENRES[genres[2]]}</span>}
    </div>
  );
};
