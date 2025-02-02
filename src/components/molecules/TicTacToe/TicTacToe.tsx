export interface TicTacToeProps {

}

export const TicTacToe = () => {
    return (
        <div className="grid grid-cols-3 gap-1">
            {Array(9).fill(null).map((_, index) => (
                <div
                    key={index}
                    className="h-12 w-12 border-2 border-gray-700 flex items-center justify-center text-4xl cursor-pointer"
                />
            ))}
        </div>
    );
};