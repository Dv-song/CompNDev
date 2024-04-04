"use client";

import Image from "next/image";
import bookdata from "./assets/book-data.json";
import BookItem from "./components/bookcard";
import NavBar from "./components/NavBar";

import React, { useState, useEffect } from "react";

export default function Home() {
  const [books, setBooks] = useState(bookdata);
  const [formatFilter, setFormatFilter] = useState("");
  const [listTypeFilter, setListTypeFilter] = useState("");
  const [sortCriteria, SetSortCriteria] = useState({ filter: "", order: "" });

  //for aggregating features: favorites and carts
  const [totalPrice, setTotalPrice] = useState(0.0);
  const [favorites, setFavorites] = useState({});
  const [cartItems, setCartItems] = useState({});

  const updateCart = (cartItemsBefore, item) => {
    const { title } = item;
    const newItemCount = cartItemsBefore[title]
      ? cartItemsBefore[title] + 1
      : 1;
    return { ...cartItemsBefore, [title]: newItemCount };
  };

  const addToCart = (item) => {
    setTotalPrice((totalpricebefore) => totalpricebefore + item.price);
    setCartItems((cartItemsBefore) => updateCart(cartItemsBefore, item));
  };

  const addToFavorites = (title) => {
    setFavorites((currentFavorites) => {
      if (currentFavorites[title]) {
        const { [title]: value, ...rest } = currentFavorites;
        return rest;
      } else {
        return { ...currentFavorites, [title]: true };
      }
    });
  };

  const filteredBooks = books.filter((book) => {
    return (
      (formatFilter
        ? book.format.includes(formatFilter) || book.format === formatFilter
        : true) && (listTypeFilter ? book.list_type === listTypeFilter : true)
    );
  });

  //sorting books

  const sortedBooks = filteredBooks.sort((a, b) => {
    if (sortCriteria.field && sortCriteria.order) {
      let att_A = a[sortCriteria.field];
      let att_B = b[sortCriteria.field];

      if (sortCriteria.field === "published") {
        att_A = new Date(att_A).getTime();
        att_B = new Date(att_B).getTime();
      }
      return sortCriteria.order === "asc" ? att_A - att_B : att_B - att_A;
    }
    return 0;
  });

  //for reset
  const resetFilters = () => {
    setFormatFilter("");
    setListTypeFilter("");
    SetSortCriteria({ filter: "", order: "" });
  };

  const emptyCart = () => {
    setCartItems({});
    setTotalPrice(0.0);
  };

  return (
    <main>
      <NavBar />

      <div className="filters">
        <select onChange={(e) => setFormatFilter(e.target.value)}>
          <option value="">All Formats</option>
          <option value="kindle">Kindle</option>
          <option value="paper">Paper</option>
        </select>

        <select onChange={(e) => setListTypeFilter(e.target.value)}>
          <option value="">All List Types</option>
          <option value="Dave's fav">Dave's List</option>
          <option value="Bestsellers">Bestsellers</option>
        </select>

        <select
          onChange={(e) =>
            SetSortCriteria({ ...sortCriteria, field: e.target.value })
          }
        >
          <option value="">Sort By</option>
          <option value="published">Published Date</option>
          <option value="rating">Rating</option>
          <option value="price">Price</option>
        </select>

        <button
          onClick={() => SetSortCriteria({ ...sortCriteria, order: "asc" })}
        >
          Ascending
        </button>
        <button
          onClick={() => SetSortCriteria({ ...sortCriteria, order: "desc" })}
        >
          Descending
        </button>

        <button onClick={resetFilters} className="resetButton">
          Reset Filters & Sorting
        </button>
      </div>

      <div className="listingAndCart">
        <div className="list">
          {sortedBooks.map((item, index) => (
            <BookItem
              key={item.title}
              {...item}
              addToCart={() => addToCart(item)}
              addToFavorites={() => addToFavorites(item.title)}
              favorites={favorites}
            ></BookItem>
          ))}
        </div>

        <div className="agg">
          <div className="Liked">
            <h2>Favorites</h2>
            <ul>
              {Object.keys(favorites).map((title) => (
                <li key={title}>{title}</li>
              ))}
            </ul>
          </div>
          <div className="Cart">
            <h2>Cart</h2>
            {Object.entries(cartItems).map(([title, quantity]) => {
              return (
                <p key={title} className="mb-[1rem] font-semibold">
                  {title} - Quantity: {quantity}
                </p>
              );
            })}
            <p className="text-xl">Total:${totalPrice.toFixed(2)}</p>
            <p>
              Total Book Count:{" "}
              {Object.values(cartItems).reduce(
                (total, quantity) => total + quantity,
                0
              )}
            </p>
            <button onClick={emptyCart} className="clearCartButton">
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
