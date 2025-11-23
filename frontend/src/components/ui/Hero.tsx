import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <div className="relative flex flex-col items-center justify-center h-[90vh] overflow-hidden bg-neutral-50">
            {/* Aurora Background Effect */}
            <div className="absolute inset-0 w-full h-full opacity-50 pointer-events-none">
                <div
                    className={cn(
                        "absolute -inset-[10px] opacity-50",
                        "[--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]",
                        "[--aurora:repeating-linear-gradient(100deg,var(--primary-300)_10%,var(--primary-200)_15%,var(--primary-100)_20%,var(--secondary-200)_25%,var(--primary-300)_30%)]",
                        "[background-image:var(--white-gradient),var(--aurora)]",
                        "[background-size:300%,_200%]",
                        "[background-position:50%_50%,50%_50%]",
                        "filter blur-[10px] invert dark:invert-0",
                        "after:content-[''] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)]",
                        "after:[background-size:200%,_100%] after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference",
                        "pointer-events-none absolute -inset-[10px] opacity-50"
                    )}
                ></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-5xl font-bold tracking-tight text-neutral-900 md:text-7xl lg:text-8xl"
                >
                    Lencería para tu <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
                        Estilo Moderno
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="mt-6 text-lg text-neutral-600 max-w-2xl"
                >
                    Descubre nuestra colección curada de piezas premium diseñadas para elevar tu confianza y comodidad diaria.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="mt-10 flex gap-4"
                >
                    <Link
                        to="/products"
                        className="px-8 py-4 text-lg font-medium text-white transition-all rounded-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 hover:scale-105 shadow-lg shadow-primary-500/30"
                    >
                        Ver Colección
                    </Link>
                    <Link
                        to="/products"
                        className="px-8 py-4 text-lg font-medium text-primary-700 transition-all rounded-full bg-primary-50 hover:bg-primary-100 border-2 border-primary-200 hover:border-primary-300"
                    >
                        Conócenos
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
