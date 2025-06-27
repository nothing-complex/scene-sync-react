
import { registerPDFFonts } from '../fontUtils_backup';

export class FontManager {
  private fontsRegistered: boolean = false;

  async ensureFontsRegistered(): Promise<void> {
    if (!this.fontsRegistered) {
      try {
        console.log('FontManager: Registering PDF fonts...');
        registerPDFFonts();
        this.fontsRegistered = true;
        console.log('FontManager: PDF fonts registered successfully');
        
        // Give fonts time to register properly
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.warn('FontManager: Font registration failed, using system fallbacks:', error);
        // Mark as registered to prevent retry loops
        this.fontsRegistered = true;
      }
    }
  }

  reset(): void {
    this.fontsRegistered = false;
  }
}
