import { useState, useCallback } from 'react'
import { Chess } from 'chess.js'
import { RotateCcw, Flag, Users, Swords, Clock } from 'lucide-react'

const PIECE_UNICODE = {
    wk: '♔', wq: '♕', wr: '♖', wb: '♗', wn: '♘', wp: '♙',
    bk: '♚', bq: '♛', br: '♜', bb: '♝', bn: '♞', bp: '♟',
}

const RANKS = [8, 7, 6, 5, 4, 3, 2, 1]
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

export default function ChessGame() {
    const [game, setGame] = useState(new Chess())
    const [selectedSquare, setSelectedSquare] = useState(null)
    const [validMoves, setValidMoves] = useState([])
    const [moveHistory, setMoveHistory] = useState([])

    const board = game.board()

    const handleSquareClick = useCallback((row, col) => {
        const square = FILES[col] + RANKS[row]
        const piece = game.get(square)

        if (selectedSquare) {
            // Try to make a move
            try {
                const gameCopy = new Chess(game.fen())
                const move = gameCopy.move({
                    from: selectedSquare,
                    to: square,
                    promotion: 'q',
                })

                if (move) {
                    setGame(gameCopy)
                    setMoveHistory(prev => [...prev, move.san])
                    setSelectedSquare(null)
                    setValidMoves([])

                    if (gameCopy.isCheckmate()) {
                        setTimeout(() => alert('Checkmate! You win!'), 100)
                    } else if (!gameCopy.isGameOver()) {
                        // Simple AI: random move after a short delay
                        setTimeout(() => {
                            const moves = gameCopy.moves()
                            if (moves.length > 0) {
                                const randomMove = moves[Math.floor(Math.random() * moves.length)]
                                const aiCopy = new Chess(gameCopy.fen())
                                const aiMove = aiCopy.move(randomMove)
                                if (aiMove) {
                                    setGame(aiCopy)
                                    setMoveHistory(prev => [...prev, aiMove.san])

                                    if (aiCopy.isCheckmate()) {
                                        setTimeout(() => alert('Checkmate! AI wins!'), 100)
                                    }
                                }
                            }
                        }, 500)
                    }
                    return
                }
            } catch (e) {
                // Invalid move
            }
        }

        // Select piece
        if (piece && piece.color === 'w') {
            setSelectedSquare(square)
            const moves = game.moves({ square, verbose: true })
            setValidMoves(moves.map(m => m.to))
        } else {
            setSelectedSquare(null)
            setValidMoves([])
        }
    }, [game, selectedSquare])

    const resetGame = () => {
        setGame(new Chess())
        setSelectedSquare(null)
        setValidMoves([])
        setMoveHistory([])
    }

    const getSquareColor = (row, col) => {
        return (row + col) % 2 === 0 ? 'bg-white' : 'bg-neutral-800'
    }

    const getPieceSymbol = (piece) => {
        if (!piece) return null
        return PIECE_UNICODE[piece.color + piece.type]
    }

    const status = game.isCheckmate()
        ? '♚ Checkmate!'
        : game.isDraw()
            ? '🤝 Draw'
            : game.isCheck()
                ? '⚠️ Check!'
                : game.turn() === 'w'
                    ? '⬜ Your turn'
                    : '⬛ Opponent thinking...'

    return (
        <div className="grid lg:grid-cols-3 gap-6 h-full">
            {/* Chess Board */}
            <div className="lg:col-span-2 glass-card p-6 flex flex-col items-center justify-center">
                <div className="flex items-center justify-between w-full max-w-[480px] mb-4">
                    <h3 className="font-display font-bold text-white flex items-center gap-2">
                        <Swords className="w-5 h-5 text-purple-400" /> Chess Match
                    </h3>
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${game.isGameOver() ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                        {status}
                    </span>
                </div>

                {/* Board */}
                <div className="border-2 border-white/10 rounded-xl overflow-hidden shadow-2xl">
                    {RANKS.map((rank, row) => (
                        <div key={rank} className="flex">
                            <div className="w-6 flex items-center justify-center text-xs text-gray-500 bg-dark-800">{rank}</div>
                            {FILES.map((file, col) => {
                                const square = file + rank
                                const piece = board[row][col]
                                const isSelected = selectedSquare === square
                                const isValidMove = validMoves.includes(square)
                                const isLastMove = moveHistory.length > 0

                                return (
                                    <button
                                        key={square}
                                        onClick={() => handleSquareClick(row, col)}
                                        className={`w-14 h-14 flex items-center justify-center text-3xl relative transition-all
                      ${getSquareColor(row, col)}
                      ${isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}
                      hover:brightness-110
                    `}
                                    >
                                        {piece && (
                                            <span className={`${piece.color === 'w' ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]' : 'text-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]'} select-none`}>
                                                {getPieceSymbol(piece)}
                                            </span>
                                        )}
                                        {isValidMove && (
                                            <div className={`absolute inset-0 flex items-center justify-center ${piece ? '' : ''}`}>
                                                <div className={`rounded-full ${piece ? 'w-12 h-12 border-4 border-blue-500/50' : 'w-4 h-4 bg-blue-500/40'}`} />
                                            </div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    ))}
                    <div className="flex">
                        <div className="w-6 bg-dark-800" />
                        {FILES.map(f => (
                            <div key={f} className="w-14 flex items-center justify-center text-xs text-gray-500 bg-dark-800 py-1">{f}</div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 mt-4">
                    <button onClick={resetGame} className="btn-secondary text-sm flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" /> New Game
                    </button>
                    <button className="btn-secondary text-sm flex items-center gap-2">
                        <Flag className="w-4 h-4" /> Resign
                    </button>
                </div>
            </div>

            {/* Side Panel */}
            <div className="glass-card p-6 flex flex-col">
                <h3 className="font-display font-bold text-white mb-4">♟️ Move History</h3>
                <div className="flex-1 overflow-y-auto space-y-1 mb-4 max-h-80">
                    {moveHistory.length === 0 ? (
                        <p className="text-gray-500 text-sm">No moves yet. Click a piece to start!</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-1">
                            {moveHistory.map((move, i) => (
                                <div key={i} className={`px-3 py-1.5 rounded-lg text-sm ${i % 2 === 0 ? 'bg-white/5 text-white' : 'bg-white/5 text-gray-400'
                                    }`}>
                                    {i % 2 === 0 && <span className="text-gray-600 mr-1">{Math.floor(i / 2) + 1}.</span>}
                                    {move}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Challenge Friends */}
                <div className="border-t border-white/10 pt-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Challenge a Colleague</h4>
                    <div className="space-y-2">
                        {['Priya', 'Rahul', 'Ananya'].map(name => (
                            <div key={name} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt="" className="w-8 h-8 rounded-full" />
                                <span className="text-sm text-gray-300 flex-1">{name}</span>
                                <button className="text-xs px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
                                    Challenge
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
