import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import toast from "react-hot-toast";

const email = localStorage.getItem('email');
console.log("email", email);
function EmailConfirmation() {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const navigate = useNavigate();

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        
        if (value && index < 5) {
            document.getElementById(`code-${index + 1}`)?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            document.getElementById(`code-${index - 1}`)?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const verificationCode = code.join('');
        
        if (verificationCode.length !== 6) {
            toast.error('Veuillez entrer le code complet');
            return;
        }
        
        setIsVerifying(true);
        try {
            await axios.post('/api/users/confirmation-email', {
                email,
                code: code
            });
            console.log("code sent", code);
            toast.success('Email vérifié avec succès!');
            setTimeout(() => navigate('/login'), 1500);
        } catch (error: any) {
            toast.error(error.response?.data?.msg || 'Code invalide');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        try {
            await axios.post('/api/users/resend-code');
            toast.success('Code renvoyé!');
        } catch (error: any) {
            console.error('Resend error:', error);
            toast.error('Erreur lors du renvoi');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-600 to-blue-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Vérification Email</h1>
                    <p className="text-gray-500 text-sm">Entrez le code à 6 chiffres envoyé à votre email</p>
                </div>

                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="flex justify-center gap-2 mb-6">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                id={`code-${index}`}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-cyan-600"
                                aria-label={`Code digit ${index + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={isVerifying}
                        className="w-full bg-cyan-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-colors disabled:opacity-50 mb-4"
                    >
                        {isVerifying ? 'Vérification...' : 'Vérifier'}
                    </button>

                    <div className="text-center">
                        <p className="text-gray-500 text-sm">
                            Code non reçu ?{' '}
                            <button type="button" onClick={handleResend} className="text-cyan-600 hover:text-cyan-500 font-medium">
                                Renvoyer
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EmailConfirmation;
