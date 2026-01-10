const form = document.getElementById('contactForm');
const status = document.getElementById('form-status');

const fields = {
	name: {
		input: document.getElementById('name'),
		error: document.getElementById('name-error'),
	},
	email: {
		input: document.getElementById('email'),
		error: document.getElementById('email-error'),
	},
	phone: {
		input: document.getElementById('phone'),
		error: document.getElementById('phone-error'),
	},
	category: {
		input: document.getElementById('category'),
		error: document.getElementById('category-error'),
	},
	message: {
		input: document.getElementById('message'),
		error: document.getElementById('message-error'),
	},
	attachment: {
		input: document.getElementById('attachment'),
		error: document.getElementById('attachment-error'),
		name: document.getElementById('attachment-name'),
	},
};

const isBlank = (value) => value.trim().length === 0;

const setError = (field, message) => {
	field.error.textContent = message;
	field.input.setAttribute('aria-invalid', 'true');
};

const clearError = (field) => {
	field.error.textContent = '';
	field.input.removeAttribute('aria-invalid');
};

const validateName = () => {
	if (isBlank(fields.name.input.value)) {
		setError(fields.name, '名前を入力してください');
		return false;
	}
	clearError(fields.name);
	return true;
};

const validateEmail = () => {
	const value = fields.email.input.value.trim();
	if (value.length === 0) {
		setError(fields.email, 'メールアドレスを入力してください');
		return false;
	}
	if (!fields.email.input.checkValidity()) {
		setError(fields.email, 'メール形式が正しくありません');
		return false;
	}
	clearError(fields.email);
	return true;
};

const validatePhone = () => {
	const value = fields.phone.input.value.trim();
	if (value.length === 0) {
		clearError(fields.phone);
		return true;
	}
	const phonePattern = /^[0-9+()\- ]+$/;
	if (!phonePattern.test(value)) {
		setError(fields.phone, '電話番号の形式が正しくありません');
		return false;
	}
	clearError(fields.phone);
	return true;
};

const validateCategory = () => {
	if (fields.category.input.value === '') {
		setError(fields.category, '種別を選択してください');
		return false;
	}
	clearError(fields.category);
	return true;
};

const validateMessage = () => {
	if (isBlank(fields.message.input.value)) {
		setError(fields.message, '内容を入力してください');
		return false;
	}
	clearError(fields.message);
	return true;
};

const isAllowedFile = (file) => {
	const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
	const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];

	if (allowedTypes.includes(file.type)) {
		return true;
	}

	const name = file.name.toLowerCase();
	return allowedExtensions.some((ext) => name.endsWith(ext));
};

const validateAttachment = () => {
	const file = fields.attachment.input.files[0];
	if (!file) {
		clearError(fields.attachment);
		return true;
	}
	if (!isAllowedFile(file)) {
		setError(fields.attachment, '対応していないファイル形式です');
		return false;
	}
	clearError(fields.attachment);
	return true;
};

const updateMessageCount = () => {
	const count = document.getElementById('message-count');
	const maxLength = Number(fields.message.input.getAttribute('maxlength'));
	const currentLength = fields.message.input.value.length;
	const remaining = Math.max(maxLength - currentLength, 0);

	count.textContent = `残り ${remaining} 文字`;
	count.classList.toggle('is-limit', remaining === 0);
};

const resetStatus = () => {
	status.textContent = '';
	status.classList.remove('is-success');
};

fields.name.input.addEventListener('blur', validateName);
fields.email.input.addEventListener('blur', validateEmail);
fields.message.input.addEventListener('blur', validateMessage);
fields.message.input.addEventListener('input', updateMessageCount);

fields.attachment.input.addEventListener('change', () => {
	const file = fields.attachment.input.files[0];
	fields.attachment.name.textContent = file ? file.name : '未選択';
	if (file && !isAllowedFile(file)) {
		setError(fields.attachment, '対応していないファイル形式です');
		fields.attachment.input.value = '';
		fields.attachment.name.textContent = '未選択';
	} else {
		clearError(fields.attachment);
	}
});

form.addEventListener('submit', (event) => {
	event.preventDefault();
	resetStatus();

	const validations = [
		validateName(),
		validateEmail(),
		validatePhone(),
		validateCategory(),
		validateMessage(),
		validateAttachment(),
	];

	if (validations.every(Boolean)) {
		status.textContent = '送信はモックです。内容は送信されません。';
		status.classList.add('is-success');
		form.reset();
		updateMessageCount();
		fields.attachment.name.textContent = '未選択';
	}
});

updateMessageCount();
