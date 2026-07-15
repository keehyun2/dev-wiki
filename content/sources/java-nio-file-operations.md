# Java NIO File Operations

Comprehensive guide to Java NIO file I/O operations using `java.nio.file.Path` and `java.nio.file.Files` APIs.

## Core Concepts

### Path Creation and Resolution

**Path creation methods:**
- `Paths.get("path/to/file")` — Java 7+
- `Path.of("path/to/file")` — Java 11+ (shorthand for Paths.get())

**Common Path operations:**
```java
Path p1 = Paths.get("some/folder/file.txt");
Path resolved = p1.resolve("child.txt");   // Append to path
Path parent = p1.getParent();              // Get parent directory
Path fileName = p1.getFileName();          // Get filename only
Path abs = p1.toAbsolutePath();            // Convert to absolute path
Path normalized = p1.normalize();          // Clean up "." and ".." segments
```

### File Existence and Type Checking

```java
Files.exists(path)           // File exists
Files.notExists(path)        // File does not exist
Files.isDirectory(path)      // Is directory
Files.isRegularFile(path)    // Is regular file
```

## File Creation

### Directory Creation
```java
Files.createDirectory(path)    // Single level, throws if parent missing
Files.createDirectories(path)  // Creates parent dirs as needed, safest option
```

### File Creation
```java
Files.createFile(path)  // Creates empty file, throws FileAlreadyExistsException if exists
```

**Best practice:** Check existence first or handle exception appropriately.

## File Reading

### Java 11+ (Simplest)
```java
String content = Files.readString(path);  // Read entire file as String
```

### Java 8+ (Compatible)
```java
String content = new String(Files.readAllBytes(path), StandardCharsets.UTF_8);
List<String> lines = Files.readAllLines(path);  // Read as List<String>
```

### Large Files (Stream-based)
```java
try (Stream<String> lines = Files.lines(path)) {
    lines.forEach(System.out::println);
}
```

## File Writing

### Java 11+
```java
Files.writeString(path, "content");  // Overwrite existing file

// Append mode
Files.writeString(path, "content", 
    StandardOpenOption.CREATE, StandardOpenOption.APPEND);
```

### Java 8+
```java
Files.write(path, content.getBytes(StandardCharsets.UTF_8));
Files.write(path, linesList, StandardOpenOption.CREATE);
```

## File Operations

### Copy/Move/Delete
```java
Files.copy(src, dest, StandardCopyOption.REPLACE_EXISTING);
Files.move(src, dest, StandardCopyOption.REPLACE_EXISTING);
Files.delete(path);           // Throws if file doesn't exist
Files.deleteIfExists(path);   // Returns false if doesn't exist, safer
```

## Directory Traversal

### List Directories (One Level)
```java
try (Stream<Path> stream = Files.list(dir)) {
    stream.forEach(System.out::println);
}
```

### Recursive Walk
```java
try (Stream<Path> stream = Files.walk(dir)) {
    stream.filter(Files::isRegularFile)
          .forEach(System.out::println);
}
```

### Search with Pattern
```java
try (Stream<Path> stream = Files.find(dir, Integer.MAX_VALUE,
        (p, attr) -> p.toString().endsWith(".txt"))) {
    stream.forEach(System.out::println);
}
```

## File Information

```java
long size = Files.size(path);                    // File size in bytes
FileTime modified = Files.getLastModifiedTime(path);  // Last modified timestamp
```

## Java Version Differences

### Key Java 11+ Additions
- `Path.of()` — Shorthand for `Paths.get()`
- `Files.readString()` — Direct string reading
- `Files.writeString()` — Direct string writing

### Java 8 Compatibility
- Use `Paths.get()` instead of `Path.of()`
- Use `Files.readAllBytes()` + `new String()` for text reading
- Use `Files.write()` with byte arrays for text writing

## Best Practices

1. **Resource Management:** Always use try-with-resources for streams
   ```java
   try (Stream<String> lines = Files.lines(path)) {
       // Process lines
   }
   ```

2. **Exception Handling:** Choose between exception-throwing vs safe methods
   - `Files.createFile()` throws if exists → Check `Files.exists()` first
   - `Files.delete()` throws if missing → Use `Files.deleteIfExists()`

3. **Encoding:** Always specify character encoding for text files
   ```java
   Files.readString(path, StandardCharsets.UTF_8)
   ```

4. **Options:** Use `StandardOpenOption` for write behavior control
   - `CREATE` — Create if doesn't exist
   - `APPEND` — Append to existing file
   - `TRUNCATE_EXISTING` — Overwrite existing content

## References

- [[concepts/java-io]] — Java I/O operations overview
- [[concepts/java-streams]] — Java Stream API usage
