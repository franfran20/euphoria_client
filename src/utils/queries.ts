import { gql } from "@apollo/client";

export const GET_FIRST_FIVE_BOOKS = gql`
  query firstFive {
    euphoriaBookCreateds(first: 3) {
      bookId
      coverImage
      name
      writer
      genres
      createdAt
      chaptersWritten
    }
  }
`;

export const GET_ALL_BOOKS = gql`
  query allBooks {
    euphoriaBookCreateds {
      bookId
      coverImage
      name
      writer
      genres
      createdAt
      chaptersWritten
    }
  }
`;
