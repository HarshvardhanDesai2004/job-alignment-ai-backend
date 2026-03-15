from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import numpy as np
import torch
from typing import List, Optional


app = FastAPI(title="Semantic AI Engine")

device = "cuda" if torch.cuda.is_available() else "cpu"

model = SentenceTransformer("all-MiniLM-L6-v2", device=device) 
model.max_seq_length = 256

@app.get("/health")
def health():
    return {"status": "ok", "message": "Semantic AI service running"}



class SemanticSkillRequest(BaseModel):
    resume_skills: Optional[List[str]] = None
    resume_embeddings: Optional[List[float]] = None
    jd_skills: List[str]


@app.post("/semantic-skill-match")
def semantic_skill_match(data: SemanticSkillRequest):

    jd_skills = data.jd_skills

    if not jd_skills:
        return {
            "semanticMatchScore": 0,
            "semanticMissingSkills": []
        }

    # Use stored embedding if available
    if data.resume_embeddings:
        resume_embeddings = np.array([data.resume_embeddings])

    elif data.resume_skills and len(data.resume_skills) > 0:
        resume_embeddings = model.encode(
            data.resume_skills,
            normalize_embeddings=True
        )

    else:
        return {
            "semanticMatchScore": 0,
            "semanticMissingSkills": jd_skills
        }

    # Encode JD skills (always required)
    jd_embeddings = model.encode(
        jd_skills,
        normalize_embeddings=True
    )

    # Fast cosine similarity via matrix multiplication
    similarity_matrix = np.matmul(jd_embeddings, resume_embeddings.T)

    matched = []
    missing = []
    total_score = 0

    for i, jd_skill in enumerate(jd_skills):
        max_similarity = float(np.max(similarity_matrix[i]))

        if max_similarity >= 0.75:
            matched.append(jd_skill)
            total_score += 1.0

        elif max_similarity >= 0.55:
            matched.append(jd_skill)
            total_score += 0.7

        elif max_similarity >= 0.40:
            total_score += 0.4
            missing.append(jd_skill)

        else:
            missing.append(jd_skill)

    final_score = (total_score / len(jd_skills)) * 100

    return {
        "semanticMatchScore": round(final_score, 2),
        "semanticMissingSkills": missing
    }



#embeddings

class EmbeddingRequest(BaseModel):
    text: str


@app.post("/generate-embeddings")
def generate_embeddings(data: EmbeddingRequest):

    if not data.text or len(data.text.strip()) == 0:
        return {"embeddings": []}

    embedding = model.encode(
        data.text,
        normalize_embeddings=True
    )

    return {
        "embeddings": embedding.tolist()
    }