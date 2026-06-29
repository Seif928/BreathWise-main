import 'package:flutter_test/flutter_test.dart';
import 'package:breathwise/models/user.dart';
import 'package:breathwise/models/diagnosis.dart';

void main() {
  group('UserModel Tests', () {
    test('should parse user JSON successfully', () {
      final json = {
        'id': 42,
        'email': 'patient@example.com',
        'first_name': 'John',
        'last_name': 'Doe',
        'phone_number': '+1234567',
        'age': 30,
        'gender': 'M',
        'is_staff': false,
      };

      final user = UserModel.fromJson(json);

      expect(user.id, 42);
      expect(user.email, 'patient@example.com');
      expect(user.firstName, 'John');
      expect(user.lastName, 'Doe');
      expect(user.fullName, 'John Doe');
      expect(user.phoneNumber, '+1234567');
      expect(user.age, 30);
      expect(user.gender, 'M');
      expect(user.isStaff, false);
    });

    test('should serialize to JSON correctly', () {
      final user = UserModel(
        id: 42,
        email: 'patient@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1234567',
        age: 30,
        gender: 'M',
      );

      final json = user.toJson();

      expect(json['id'], 42);
      expect(json['email'], 'patient@example.com');
      expect(json['first_name'], 'John');
      expect(json['last_name'], 'Doe');
      expect(json['phone_number'], '+1234567');
      expect(json['age'], 30);
      expect(json['gender'], 'M');
    });
  });

  group('DiagnosisModel Tests', () {
    test('should parse diagnosis JSON successfully', () {
      final json = {
        'id': 101,
        'user': 42,
        'image': 'http://127.0.0.1:8000/media/scans/chest.png',
        'created_at': '2026-06-19T02:00:00Z',
        'uploaded_at': '2026-06-19T02:00:00Z',
        'disease_type': 'Pneumonia',
        'confidence': 0.85,
        'notes': 'Significant consolidation observed.',
      };

      final diagnosis = DiagnosisModel.fromJson(json);

      expect(diagnosis.id, 101);
      expect(diagnosis.userId, 42);
      expect(diagnosis.imageUrl, 'http://127.0.0.1:8000/media/scans/chest.png');
      expect(diagnosis.diseaseType, 'Pneumonia');
      expect(diagnosis.confidence, 0.85);
      expect(diagnosis.notes, 'Significant consolidation observed.');
      expect(diagnosis.isCompleted, true);
    });
  });
}
