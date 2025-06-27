
import { registerPDFFonts } from '../fontUtils_backup';

export class FontManager {
  private fontsRegistered: boolean = false;

  async ensureFontsRegistered(): Promise<void> {
    if (!this.fontsRegistered) {
      try {
        console.log('FontManager: Registering system fonts...');
        const success = registerPDFFonts();
        this.fontsRegistered = success;
        console.log('FontManager: Font registration completed, success:', success);
        
        // Minimal delay for font registration
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn('FontManager: Font registration failed, using defaults:', error);
        this.fontsRegistered = true; // Prevent retry loops
      }
    }
  }

  reset(): void {
    this.fontsRegistered = false;
  }
}
