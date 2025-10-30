import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";

type Artwork = {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
};

const ArtworkTable: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [rowCount, setRowCount] = useState<string>("");
  const overlayRef = useRef<OverlayPanel>(null);

  // Fetch data for current page
  const getArtworks = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`);
      const data = await response.json();

      const formatted: Artwork[] = data.data.map((item: any) => ({
        id: item.id,
        title: item.title || "Untitled",
        place_of_origin: item.place_of_origin || "Unknown",
        artist_display: item.artist_display || "Not Available",
        inscriptions: item.inscriptions || "-",
        date_start: item.date_start || 0,
        date_end: item.date_end || 0,
      }));

      setArtworks(formatted);
      setTotalCount(data.pagination?.total || 100);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getArtworks(currentPage);
  }, [currentPage]);

  // Preserve selection across pages
  const handleRowSelection = (e: { value: Artwork[] }) => {
    const idsOnPage = artworks.map((item) => item.id);
    const selectedNow = e.value.map((item) => item.id);

    setSelectedIds((prev) => {
      const updated = new Set(prev);
      idsOnPage.forEach((id) => updated.delete(id));
      selectedNow.forEach((id) => updated.add(id));
      return updated;
    });
  };

  const selectedForPage = artworks.filter((item) => selectedIds.has(item.id));

  // Add selected rows by number
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(rowCount);
    if (!isNaN(num) && num > 0) {
      const idsToAdd = artworks.slice(0, num).map((a) => a.id);
      setSelectedIds((prev) => {
        const updated = new Set(prev);
        idsToAdd.forEach((id) => updated.add(id));
        return updated;
      });
    }
    setRowCount("");
    overlayRef.current?.hide();
  };

  // Custom header (icon on left of title)
  const titleHeader = (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <Button
        icon="pi pi-angle-down"
        text
        aria-label="Select Rows"
        onClick={(e) => overlayRef.current?.toggle(e)}
        style={{ padding: "0", height: "auto", color: "#000000" }}
      />
      <span>Title</span>

      <OverlayPanel ref={overlayRef}>
        <form
          onSubmit={handleFormSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            width: "150px",
            padding: "4px",
          }}
        >
          <input
            type="number"
            value={rowCount}
            onChange={(e) => setRowCount(e.target.value)}
            placeholder="Enter rows"
            style={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "6px",
              fontSize: "0.9rem",
            }}
          />
          <Button type="submit" label="Submit" size="small" />
        </form>
      </OverlayPanel>
    </div>
  );

  return (
    <div style={{ padding: "1rem" }}>
      <p>
        <strong>Selected Rows:</strong> {selectedIds.size}
      </p>

      <DataTable
        value={artworks}
        dataKey="id"
        paginator
        rows={10}
        totalRecords={totalCount}
        lazy
        first={(currentPage - 1) * 10}
        onPage={(e) => setCurrentPage((e.page ?? 0) + 1)} // ✅ fixed undefined error
        loading={loading}
        selectionMode="checkbox"
        selection={selectedForPage}
        onSelectionChange={handleRowSelection}
      >
        <Column selectionMode="multiple" style={{ width: "3em" }} />
        <Column field="title" header={titleHeader} />
        <Column field="place_of_origin" header="Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Year" />
        <Column field="date_end" header="End Year" />
      </DataTable>
    </div>
  );
};

export default ArtworkTable;
