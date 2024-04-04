export default function Bookcard({ addToCart, addToFavorites, ...bookProps }) {
  const format = Array.isArray(bookProps.format)
    ? bookProps.format.join(" & ")
    : bookProps.format;
  const authors = Array.isArray(bookProps.author)
    ? bookProps.author.join(", ")
    : bookProps.author;

  const { title, favorites } = bookProps;
  const isFavorite = favorites[title];

  return (
    <div className="bookItem p-[20px] text-[#343434]">
      <div className="item-content">
        <img src={bookProps.image} className="mx-auto mb-[10px]" />
        <h2 className="title-cut"> {bookProps.title} </h2>
        <p className="bookFormat">{format}</p>
        <p>By: {authors}</p>
        <p>From: {bookProps.list_type}</p>
        <p>Published: {bookProps.published}</p>
      </div>
      <p className="price">${bookProps.price}</p>
      <div className="item-section">
        <img
          src={isFavorite ? "favorite-1.svg" : "favorite.svg"}
          alt="favorite icon"
          className="like"
          onClick={() => addToFavorites(bookProps.title)}
          style={{ cursor: "pointer" }}
        />
        <button className="button" onClick={() => addToCart(bookProps.item)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
