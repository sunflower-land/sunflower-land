import { FeedFilter } from "../Feed";

const storeFilter = (filter: string) => {
  localStorage.setItem("socialFeedFilter", filter);
};

const getFilter = (): FeedFilter => {
  const filter = localStorage.getItem("socialFeedFilter") as FeedFilter;

  return filter ?? "all";
};

export { storeFilter, getFilter };
