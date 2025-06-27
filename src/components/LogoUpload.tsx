
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LogoUploadProps {
  onLogoChange: (logoData: { url: string; size: 'small' | 'medium' | 'large' } | null) => void;
  currentLogo?: { url: string; size: 'small' | 'medium' | 'large' } | null;
}

export const LogoUpload = ({ onLogoChange, currentLogo }: LogoUploadProps) => {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateImage = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check file type - allow PNG and SVG
      if (!['image/png', 'image/svg+xml'].includes(file.type)) {
        setError('Only PNG and SVG files are allowed');
        resolve(false);
        return;
      }

      // For SVG files, check file size (1MB max for SVG)
      if (file.type === 'image/svg+xml') {
        if (file.size > 1 * 1024 * 1024) {
          setError('SVG file size must be less than 1MB');
          resolve(false);
          return;
        }
        setError(null);
        resolve(true);
        return;
      }

      // For PNG files, check file size (5MB max) and dimensions
      if (file.type === 'image/png') {
        if (file.size > 5 * 1024 * 1024) {
          setError('PNG file size must be less than 5MB');
          resolve(false);
          return;
        }

        // Check PNG image dimensions
        const img = new Image();
        img.onload = () => {
          if (img.width > 400 || img.height > 400) {
            setError('PNG image dimensions must not exceed 400x400 pixels');
            resolve(false);
          } else {
            setError(null);
            resolve(true);
          }
        };
        img.onerror = () => {
          setError('Invalid PNG image file');
          resolve(false);
        };
        img.src = URL.createObjectURL(file);
      }
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const isValid = await validateImage(file);
    if (!isValid) {
      setUploading(false);
      return;
    }

    try {
      // Convert to base64 for PDF embedding
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onLogoChange({
          url: result,
          size: 'medium' // default size
        });
        setUploading(false);
      };
      reader.onerror = () => {
        setError('Failed to read file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to upload logo');
      setUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSizeChange = (size: 'small' | 'medium' | 'large') => {
    if (currentLogo) {
      onLogoChange({
        ...currentLogo,
        size
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Company Logo</Label>
        <p className="text-sm text-muted-foreground">
          Upload a PNG image (max 400x400 pixels, 5MB) or SVG file (max 1MB)
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center space-x-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/svg+xml"
          onChange={handleFileSelect}
          className="hidden"
          id="logo-upload"
        />
        
        {!currentLogo ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Uploading...' : 'Upload Logo'}</span>
          </Button>
        ) : (
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={currentLogo.url}
                alt="Company logo"
                className="w-16 h-16 object-contain border rounded bg-background"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemoveLogo}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Logo Size</Label>
              <div className="flex space-x-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <Button
                    key={size}
                    type="button"
                    variant={currentLogo.size === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSizeChange(size)}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
