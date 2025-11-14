import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../config/axios"; 
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function Register() {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cin, setCin] = useState('');
    const [role, setRole] = useState('patient');
    const [dateNaissance, setDateNaissance] = useState('');
    const [gender, setGender] = useState('');
    const [adresse, setAdresse] = useState('');
    const [telephone, setTelephone] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const { email: emailParam } = useParams();

    if (emailParam) {
        setEmail(emailParam);
    }


    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (newUser: any) => {
            return axios.post('/api/users/register', newUser)
        },
        onSuccess: () => {
            const { email } = useParams();

            toast.success("Inscription réussie! Vérifiez votre email.");
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setTimeout(() => navigate('/email-confirmation/' + email), 1500);
        },
        onError: (error: any) => {
            if (error.response) {
                toast.error(error.response.data.msg || 'An error occurred');
            } else if (error.request) {
                toast.error('No response from server');
            } else {
                toast.error('Error setting up request');
            }
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        
        console.log("data send", {   nom,
            prenom,
            email,
            motDePasse: password,
            dateNaissance,
            gender,
            adresse,
            telephone,
            CIN: cin,
            role, })


        if (!nom || !prenom || !email || !password || !role || !dateNaissance || !gender || !adresse || !telephone || !cin) {
            toast.error('All fields are required');
            return;
        }
      




        mutation.mutate({
            nom,
            prenom,
            email,
            motDePasse: password,
            dateNaissance,
            gender,
            adresse,
            telephone,
            CIN: cin,
            role,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-600 to-blue-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Carflow</h1>
                    <p className="text-gray-500 text-sm">Inscrivez-vous à votre espace médical</p>
                </div>

                <form className="mb-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Votre nom" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-600" />
                        <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Votre prénom" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-600" />
                    </div>
                    <div className="mb-4">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-600" />
                    </div>
                    <div className="mb-4">
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-600" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input type="text" value={cin} onChange={(e) => setCin(e.target.value)} placeholder="Votre CIN" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-600" />
                        <input type="date" value={dateNaissance} onChange={(e) => setDateNaissance(e.target.value)} aria-label="Date de naissance" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-600" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <select title="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-600">
                            <option value="" disabled>Sexe</option>
                            <option value="homme">Homme</option>
                            <option value="femme">Femme</option>
                        </select>
                        <select title="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-600">
                            <option value="patient">Patient</option>
                            <option value="medecin">Médecin</option>
                            <option value="infirmier">Infirmier</option>
                            <option value="pharmacien">Pharmacien</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Adresse" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-600" />
                    </div>
                    <div className="mb-4">
                        <input type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="Téléphone" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-600" />
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 mr-2 accent-cyan-600" />
                            <span>Se souvenir de moi</span>
                        </label>
                        <a href="#" className="text-sm text-cyan-600 hover:text-cyan-500">Mot de passe oublié ?</a>
                    </div>

                    <button type="submit" disabled={mutation.isPending} className="w-full bg-cyan-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-colors disabled:opacity-50">
                        {mutation.isPending ? 'Inscription...' : 'S\'inscrire'}
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-gray-500 text-sm">
                        Déjà un compte ?{' '}
                        <button onClick={() => navigate('/login')} className="text-cyan-600 hover:text-cyan-500 font-medium">Se connecter</button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
