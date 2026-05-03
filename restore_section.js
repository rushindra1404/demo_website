const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const replacement = `
    <!-- 1.9 PREMIUM MEET EXPERTS -->
    <section id="experts" class="py-32 relative z-10 overflow-hidden bg-gradient-to-br from-white via-slate-50 to-primary/5 dark:from-surface-dark dark:via-surface-black dark:to-primary/10 border-y border-slate-100 dark:border-slate-800/50">
        <!-- Floating Shapes -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-40 z-0">
            <div class="absolute w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] top-[-10%] left-[-10%]"></div>
            <div class="absolute w-[300px] h-[300px] bg-accent/10 rounded-full blur-[60px] bottom-[10%] right-[-5%] animate-pulse-glow"></div>
        </div>

        <div class="container max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <!-- Section Header -->
            <div class="text-center max-w-3xl mx-auto mb-20" data-aos="fade-up">
                <h4 class="text-primary font-semibold tracking-widest text-label uppercase mb-4">Meet The Team</h4>
                <h2 class="text-[40px] md:text-[48px] font-display font-bold text-surface-dark dark:text-surface-light mb-6 leading-tight">
                    World-Class <span class="text-gradient-primary">Expertise</span>
                </h2>
                <p class="text-sub text-slate-600 dark:text-slate-400 font-medium">
                    Led by highly experienced professionals dedicated to giving you the perfect smile.
                </p>
            </div>

            <!-- Doctors Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
                
                <!-- Doctor 1: Dr. Divya -->
                <div class="glass-card group relative overflow-hidden transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_25px_50px_rgba(14,165,233,0.15)] dark:hover:shadow-[0_25px_50px_rgba(56,189,248,0.15)] hover:border-primary/50 cursor-pointer interactive-hover flex flex-col h-full bg-white/60 dark:bg-slate-900/60" data-aos="fade-up" data-aos-delay="100">
                    
                    <!-- Glow Effect -->
                    <div class="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"></div>
                    
                    <!-- Image Area -->
                    <div class="relative w-full aspect-[4/5] sm:aspect-[4/3] md:aspect-[4/5] overflow-hidden rounded-t-[24px] z-10">
                        <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Dr. Divya" class="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105 filter brightness-105">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                        
                        <!-- Badge -->
                        <div class="absolute top-6 left-6 bg-white dark:bg-slate-800 text-surface-dark dark:text-surface-light px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 border border-slate-100 dark:border-slate-700 z-20">
                            <i class="fas fa-star text-accent"></i> 10+ Years Experience
                        </div>
                        
                        <!-- Social Icons (Hover Reveal) -->
                        <div class="absolute top-6 right-6 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-20">
                            <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary transition-colors border border-white/30">
                                <i class="fab fa-linkedin-in"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Content Area -->
                    <div class="p-8 md:p-10 relative z-20 flex flex-col flex-1">
                        <div class="w-14 h-14 rounded-[16px] glass-card flex items-center justify-center text-primary text-2xl mb-6 shadow-lg group-hover:scale-110 group-hover:text-accent transition-transform duration-300 -mt-16 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 relative z-30">
                            <i class="fas fa-user-md"></i>
                        </div>
                        
                        <h3 class="text-[28px] font-display font-bold text-surface-dark dark:text-surface-light mb-1">Dr. Divya</h3>
                        <p class="text-accent font-semibold tracking-wider text-label uppercase mb-4">Chief Dental Surgeon</p>
                        
                        <p class="text-body text-slate-500 dark:text-slate-400 mb-8 flex-1 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                            “Specializing in advanced cosmetic dentistry, full mouth rehabilitations, and smile designing with over 10 years of clinical excellence.”
                        </p>
                        
                        <button class="w-full py-4 rounded-xl font-semibold text-primary border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                            Book with Dr. Divya <i class="fas fa-arrow-right group-hover/btn:translate-x-1 transition-transform"></i>
                        </button>
                    </div>
                </div>

                <!-- Doctor 2: Dr. Ramesh -->
                <div class="glass-card group relative overflow-hidden transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_25px_50px_rgba(14,165,233,0.15)] dark:hover:shadow-[0_25px_50px_rgba(56,189,248,0.15)] hover:border-primary/50 cursor-pointer interactive-hover flex flex-col h-full bg-white/60 dark:bg-slate-900/60" data-aos="fade-up" data-aos-delay="200">
                    
                    <!-- Glow Effect -->
                    <div class="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"></div>
                    
                    <!-- Image Area -->
                    <div class="relative w-full aspect-[4/5] sm:aspect-[4/3] md:aspect-[4/5] overflow-hidden rounded-t-[24px] z-10">
                        <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Dr. Ramesh" class="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105 filter brightness-105">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                        
                        <!-- Social Icons (Hover Reveal) -->
                        <div class="absolute top-6 right-6 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-20">
                            <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary transition-colors border border-white/30">
                                <i class="fab fa-linkedin-in"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Content Area -->
                    <div class="p-8 md:p-10 relative z-20 flex flex-col flex-1">
                        <div class="w-14 h-14 rounded-[16px] glass-card flex items-center justify-center text-primary text-2xl mb-6 shadow-lg group-hover:scale-110 group-hover:text-accent transition-transform duration-300 -mt-16 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 relative z-30">
                            <i class="fas fa-tooth"></i>
                        </div>
                        
                        <h3 class="text-[28px] font-display font-bold text-surface-dark dark:text-surface-light mb-1">Dr. Ramesh</h3>
                        <p class="text-accent font-semibold tracking-wider text-label uppercase mb-4">Senior Implantologist</p>
                        
                        <p class="text-body text-slate-500 dark:text-slate-400 mb-8 flex-1 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                            “Expert in complex dental implants and oral surgeries, committed to restoring function and aesthetics safely and flawlessly.”
                        </p>
                        
                        <button class="w-full py-4 rounded-xl font-semibold text-primary border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                            Book with Dr. Ramesh <i class="fas fa-arrow-right group-hover/btn:translate-x-1 transition-transform"></i>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- Journey section removed per request -->`;

content = content.replace('    <!-- Journey section removed per request -->', replacement);
fs.writeFileSync('index.html', content);
console.log('Restored Doctors section with new text');
