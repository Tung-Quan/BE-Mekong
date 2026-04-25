-- Tạo bảng Trạm quan trắc (positions)
CREATE TABLE positions (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    distance_km DOUBLE PRECISION,
    type VARCHAR(100)
);

-- Tạo bảng Dữ liệu quan trắc (position_data)
CREATE TABLE position_data (
    id VARCHAR(50) PRIMARY KEY,
    station_id VARCHAR(50) NOT NULL REFERENCES positions(id) ON DELETE CASCADE,
    datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    salinity DOUBLE PRECISION,
    water_level DOUBLE PRECISION
);

-- Đổ sẵn một ít dữ liệu mẫu (Seed data) để test
INSERT INTO positions (id, name, latitude, longitude, distance_km, type)
VALUES 
    ('station-1', 'Trạm A', 10.35, 106.26, 2.5, 'CỐNG'),
    ('station-2', 'Trạm B', 10.40, 106.30, 5.0, 'TRẠM ĐO');

INSERT INTO position_data (id, station_id, datetime, salinity, water_level)
VALUES 
    ('obs-1', 'station-1', '2026-04-24T10:00:00Z', 1.23, 0.45),
    ('obs-2', 'station-1', '2026-04-24T12:00:00Z', 1.35, 0.50);
