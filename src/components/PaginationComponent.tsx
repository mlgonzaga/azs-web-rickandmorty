import type { Episode } from '@/interfaces/episodes'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationInfo {
    currentPage: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
    loadedPages: Record<number, Episode[]>
}

interface PaginationComponentProps {
    pagination: PaginationInfo
    onPageChange: (page: number) => void
}

export default function PaginationComponent({
    pagination,
    onPageChange
}: PaginationComponentProps) {
    const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination

    if (totalPages <= 1) return null

    const getPageNumbers = () => {
        const pages = []
        const maxVisible = 5
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
        const end = Math.min(totalPages, start + maxVisible - 1)

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1)
        }

        for (let i = start; i <= end; i++) {
            pages.push(i)
        }

        return pages
    }

    const pageNumbers = getPageNumbers()
    const firstPage = pageNumbers[0]
    const lastPage = pageNumbers[pageNumbers.length - 1]

    const handlePageClick = (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page)
        }
    }

    const handlePreviousClick = (e: React.MouseEvent) => {
        e.preventDefault()
        if (hasPrevPage) {
            handlePageClick(currentPage - 1)
        }
    }

    const handleNextClick = (e: React.MouseEvent) => {
        e.preventDefault()
        if (hasNextPage) {
            handlePageClick(currentPage + 1)
        }
    }

    return (
        <div className="flex items-center gap-4  bg-white/50 w-full sm:w-2/3 md:1/3 rounded-full px-3">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={handlePreviousClick}
                            className={!hasPrevPage ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        />
                    </PaginationItem>

                    {firstPage && firstPage > 1 && (
                        <>
                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handlePageClick(1)
                                    }}
                                    className="cursor-pointer"
                                >
                                    1
                                </PaginationLink>
                            </PaginationItem>
                            {firstPage > 2 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
                        </>
                    )}

                    {pageNumbers.map((page) => (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    handlePageClick(page)
                                }}
                                isActive={page === currentPage}
                                className={page === currentPage ? "cursor-default" : "cursor-pointer"}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    {lastPage && lastPage < totalPages && (
                        <>
                            {lastPage < totalPages - 1 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handlePageClick(totalPages)
                                    }}
                                    className="cursor-pointer"
                                >
                                    {totalPages}
                                </PaginationLink>
                            </PaginationItem>
                        </>
                    )}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={handleNextClick}
                            className={!hasNextPage ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}