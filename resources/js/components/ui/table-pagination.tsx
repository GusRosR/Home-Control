import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

import type { TablePaginationProps } from "@/types";




export function TablePagination({ from, to, total, links, onPageChange }: TablePaginationProps) {
    return (
        <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
                Showing {from} to {to} of {total} elements
            </p>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        {/* This is the button that takes us one page back */}
                        <PaginationPrevious 
                        /* This on click event allow us to change pages depending on the properties.*/
                        onClick={() => onPageChange(links[0].url)}
                        /* This line deactivates the button in case there are not more elements or pages
                        to go back to */
                        className={!links[0].url ? 'pointer-events-none opacity-50' : ''} />
                    </PaginationItem>
                    {/* This line creates the numbers between buttons so you can directly click on the page 
                    you want to go */}
                    {links.slice(1, -1).map((link, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink
                            /* This line takes us to the page we click */
                                onClick={() => onPageChange(link.url)}
                                /* This is used to determine that we are actively watching the content of this page */
                                isActive={link.active}
                                /* This line deactivates the buttons in case there's no more pages to go to */
                                className={!link.url ? 'pointer-events-none opacity-50' : ''}
                            >
                                {/* This writes the number of page for every page we have */}
                                <span dangerouslySetInnerHTML={{__html: link.label}} />
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext
                        /* This takes us one page forward */
                            onClick={() => onPageChange(links[links.length -1].url)}
                            className={!links[links.length -1].url ? 'pointer-events-none opacity-50' : ''}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

        </div>

    );
}

export default TablePagination