import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Button, Card, CardContent, CardHeader, CardTitle, Textarea, Label, Dialog, DialogContent, DialogHeader, DialogTitle as DTitle, DialogDescription } from '../components/bits';
import { IconSparkles, IconCamera, IconPlus } from '../constants';
import { useToast } from '../components/toast/useToast';

// Helper function to convert a File object to a base64 string
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
};

export const ImageAnalyzerPage: React.FC = () => {
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('What do you see in this image? Describe any notable features.');
    const [result, setResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleImageChange = (file: File | null) => {
        if (file) {
            if (file.size > 4 * 1024 * 1024) { // 4MB limit for inline data
                toast.add('Image size should be less than 4MB.', 'error');
                return;
            }
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setResult('');
            setError('');
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            handleImageChange(event.target.files[0]);
        }
    };

    const handleAnalyzeClick = async () => {
        if (!image || !prompt) {
            setError('Please upload an image and enter a prompt.');
            return;
        }

        setIsLoading(true);
        setResult('');
        setError('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const base64Data = await fileToBase64(image);

            const imagePart = {
                inlineData: {
                    mimeType: image.type,
                    data: base64Data,
                },
            };
            const textPart = {
                text: prompt,
            };
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [imagePart, textPart] },
            });
            
            setResult(response.text);

        } catch (err: any) {
            console.error('Gemini API error:', err);
            const errorMessage = err.message || 'An unknown error occurred.';
            setError(`Failed to analyze image. ${errorMessage}`);
            toast.add(`Error: ${errorMessage}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            toast.add("Could not access camera. Please check permissions.", 'error');
            setIsCameraOpen(false);
        }
    }, [toast]);

    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }, []);

    useEffect(() => {
        if (isCameraOpen) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [isCameraOpen, startCamera, stopCamera]);


    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d')?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            canvas.toBlob(blob => {
                if (blob) {
                    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                    handleImageChange(file);
                }
                setIsCameraOpen(false);
            }, 'image/jpeg');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-textPrimary">AI Image Analyzer</h1>
            <p className="text-textSecondary">Upload or take a photo and ask Gemini to analyze it for you.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>1. Provide an Image</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 border-2 border-dashed border-border rounded-lg text-center aspect-video flex flex-col justify-center items-center bg-surface-soft">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Selected preview" className="max-h-full max-w-full object-contain rounded-md" />
                            ) : (
                                <div>
                                    <IconCamera className="w-16 h-16 text-textSecondary/50 mx-auto" />
                                    <p className="mt-2 text-sm text-textSecondary">Image preview will appear here</p>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-4 mt-4">
                            <Button className="w-full" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                <IconPlus className="w-4 h-4 mr-2" /> Upload from Device
                            </Button>
                            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                            <Button className="w-full" variant="outline" onClick={() => setIsCameraOpen(true)}>
                                <IconCamera className="w-4 h-4 mr-2" /> Use Camera
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>2. Ask a Question</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col h-[calc(100%-4rem)]">
                        <div className="space-y-2 flex-grow flex flex-col">
                            <Label htmlFor="prompt">Your Prompt</Label>
                            <Textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., What is in this image? Can you identify the main subject?"
                                className="flex-grow"
                            />
                        </div>
                        <Button
                            onClick={handleAnalyzeClick}
                            disabled={isLoading || !image}
                            className="mt-4 w-full"
                            size="lg"
                        >
                            {isLoading ? 'Analyzing...' : <><IconSparkles className="w-5 h-5 mr-2" /> Analyze with Gemini</>}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {(isLoading || result || error) && (
                <Card>
                    <CardHeader>
                        <CardTitle>3. Analysis Result</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading && (
                            <div className="flex items-center justify-center py-8">
                                <IconSparkles className="w-8 h-8 text-primary-DEFAULT animate-pulse" />
                                <p className="ml-4 text-textSecondary">Gemini is thinking...</p>
                            </div>
                        )}
                        {error && <p className="text-danger">{error}</p>}
                        {result && <p className="whitespace-pre-wrap text-textPrimary">{result}</p>}
                    </CardContent>
                </Card>
            )}

            <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DTitle>Capture Photo</DTitle>
                        <DialogDescription>Position the subject in the frame and capture.</DialogDescription>
                    </DialogHeader>
                    <div className="pt-4">
                        <video ref={videoRef} autoPlay playsInline className="w-full rounded-md bg-slate-900 aspect-video object-cover"></video>
                        <canvas ref={canvasRef} className="hidden"></canvas>
                        <div className="flex justify-center mt-4">
                             <Button onClick={handleCapture} size="lg">
                                <IconCamera className="w-5 h-5 mr-2" /> Snap Photo
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};