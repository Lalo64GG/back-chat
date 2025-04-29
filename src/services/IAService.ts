export const analyzeMessageWithAI = async (message: string): Promise<string> => {
    console.log("Mensaje a analizar con IA:", message);

    const MAX_RETRIES = 5; 
    let retryDelay = 1000; 

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Recommend using environment variable
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini-2024-07-18",
                    messages: [
                        { role: "system", content: "Clasifica el mensaje en: 'Hablar con operador', 'Cotizar desarrollo', 'Información producto', 'Otro'." },
                        { role: "user", content: message },
                    ],
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // Corrected line: data.choices[0] instead of data.choides[0]
                const aiResponse = data.choices[0].message.content.trim();
                console.log("Respuesta de IA:", aiResponse);
                return aiResponse;
            }

            if (response.status === 429) {
                console.warn(`Intento ${attempt + 1}: 429 Too Many Requests. Esperando ${retryDelay / 1000} segundos...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                retryDelay *= 2; 
                continue;
            }

            throw new Error(`Error HTTP: ${response.status}`);
        } catch (error) {
            console.error("Error al analizar el mensaje con IA:", error);
        }
    }

    return "Error en análisis después de múltiples intentos";
};