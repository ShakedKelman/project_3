import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { siteConfig } from "../SiteConfig";
import { AddImage } from "../components/AddImage"; // Ensure the correct import path
import "./VacationsPage.css";
import { getPaginatedVacationsWithImages } from "../api/vactions-api";

const VacationsPagePaginated = () => {
  const [vacations, setVacations] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedVacation, setSelectedVacation] = useState<number | undefined>();
  const [showModal, setShowModal] = useState<boolean>(false);

  const loadMoreVacations = async () => {
    const newVacations = await getPaginatedVacationsWithImages(page);
    if (newVacations.length === 0) setHasMore(false);
    else {
      setVacations([...vacations, ...newVacations]);
      setPage(page + 1);
    }
  };

  const handleAddImage = (id: number) => {
    setSelectedVacation(id);
    setShowModal(true);
  };

  return (
    <div>
      <br />
      <br />
      <br />
      {showModal && selectedVacation !== undefined && (
        <AddImage
          pid={selectedVacation}
          setShowModal={setShowModal}
          showModal={showModal}
        />
      )}
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMoreVacations}
        hasMore={hasMore}
        loader={<div key={0}>Loading...</div>}
      >
        {vacations.map((v: any) => (
          <div key={v.id} className="v-card">
            <h3>
              {v.destination} - {v.id}
            </h3>
            <p>{v.price}</p>
            {v.imageUrl && (
              <img
                className="v-image"
                src={`${siteConfig.BASE_URL}image/${v.imageUrl}`}
                alt={v.destination}
              />
            )}
            <br />
            <button onClick={() => handleAddImage(v.id)}> Add Image </button>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default VacationsPagePaginated;
